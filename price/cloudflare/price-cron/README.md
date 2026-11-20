# Cloudflare Worker 定时触发价格更新

不依赖 GitHub Actions 的 `schedule`，也不需要 Mac 开机。Cloudflare 全天每小时 :31 触发一次
`update-jx3-prices.yml` 的 `workflow_dispatch`。

## 1. 创建 GitHub 细粒度 token

打开 https://github.com/settings/personal-access-tokens/new

- Token name：`jx3-price-cloud-cron`
- Expiration：90 days（到期后更新 Cloudflare secret）
- Resource owner：`cherishXie`
- Repository access：Only select repositories → `JX3-AH-Calculator`
- Repository permissions：
  - **Actions: Read and write**
  - **Metadata: Read-only**（自动勾选）
  - 不要给 Contents / Workflows 写权限

生成后复制 token。**不要提交到仓库，也不要发到聊天里。**

## 2. 登录 Cloudflare 并设置 secret

```bash
cd cloudflare/price-cron
npx wrangler@latest login
npx wrangler@latest secret put GITHUB_TOKEN
npx wrangler@latest secret put TRIGGER_KEY
```

- `GITHUB_TOKEN` 粘贴上一步的 token。
- `TRIGGER_KEY` 自己生成一个随机值，例如 `openssl rand -hex 24`，用于手动测试。

## 3. 部署

```bash
npx wrangler@latest deploy
```

部署输出会给出 Worker URL，例如：

```text
https://jx3-price-cron.<你的子域>.workers.dev
```

Cron 已配置为 UTC：

```text
6,36 * * * *
```

对应北京时间 **全天每 30 分钟**：00:06、00:36、01:06、01:36、…、23:06、23:36。

## 4. 手动测试

```bash
curl -X POST https://jx3-price-cron.<你的子域>.workers.dev/trigger \
  -H "x-trigger-key: <你的 TRIGGER_KEY>"
```

然后去 GitHub Actions 看是否出现一条 `Update JX3 prices` 的 `workflow_dispatch` 运行。
也可以看 Worker 日志：

```bash
npx wrangler@latest tail
```

## 5. 验证定时

到下一个 :06 或 :36 后，Cloudflare 会发一次 dispatch；GitHub Actions 出现
`workflow_dispatch` 运行。Worker 日志会打印 `GitHub workflow_dispatch sent`。

## 安全说明

- token 只存在 Cloudflare encrypted secret 中，不在仓库、不在前端；
- 只有 `Actions: write`，泄露也只能触发这个仓库的工作流，不能改代码；
- token 到期后 Worker 会返回 401，重新 `secret put GITHUB_TOKEN` 即可；
- 不再需要本机 launchd，也不依赖 GitHub 的 `schedule`。
