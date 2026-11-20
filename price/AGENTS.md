# 项目协作与发布规则

- 默认开发分支为 `dev`：所有功能/修复先提交到 `dev` 并部署 dev 在线版（`https://cherishxie.github.io/JX3-AH-Calculator/dev/`，页面带 `DEV` 标识）；未经用户明确同意，不要直接推送到 `main`。
- `main` 只接受经过 dev 验证后的合并/发布提交；价格机器人仍会更新 `main` 的物价数据，合并前先同步。
- 用户明确要求只分析、只核算或暂不发布时，以该次要求为准。
- 完成当前任务后执行相关测试和构建，检查 diff，只提交本次任务涉及的文件。不要夹带其他工作中的修改、凭据或本地配置。
- 先获取并整合远端新提交，保留远端物价数据；禁止强制推送。遇到冲突应解决并重新验证。
- 发布命令：`./scripts/sync.sh "类型: 描述"`，默认推送到 `dev`；需要发布生产时使用 `BRANCH=main ./scripts/sync.sh "类型: 描述"`，且必须先获得用户确认。如存在其他任务的未提交修改，消息后追加本次文件路径，仅提交这些路径。
- 业务变动优先在 `content/updates.json` 写清楚用户能感知的变化；Action 会保留当次手写说明，后续未手写的提交则自动从提交标题/正文生成。
- 新增或修改突破模型后，执行 `node scripts/sync-breakthrough-model.mjs` 和 `node scripts/test-breakthrough.cjs`。发布流程检查 `node scripts/test-changelog.mjs`，构建小工具和静态站点。
- 推送后检查 `Deploy dev preview` 的运行结果和 dev 在线地址的 `version.json` / `updates.json`；只有确认部署成功后，才能告知用户已上线。`main` 生产部署只在用户确认发布后检查。失败时继续处理或如实说明阻碍。
- GitHub Pages 只有一个站点：`Deploy site and minitool` 与 `Deploy dev preview` 都同时构建 main 根站点和 `/dev/` 预览，互不覆盖。生产发布仍需用户明确同意后再执行 `BRANCH=main ./scripts/sync.sh`。
- GitHub Action 只能处理已推送的提交；本地提交推送由当前协作任务执行，不启用监视文件即提交的后台任务。
