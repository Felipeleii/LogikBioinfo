# GitHub MCP Server Setup

This project is preconfigured to run GitHub's Model Context Protocol (MCP) server so that Copilot Agent mode and other MCP hosts can access repository data, issues, pull requests, workflows, and more via natural language.

## Requirements

1. **Docker** – install Docker Desktop (Windows/macOS) or Docker Engine (Linux) and make sure it is running before starting the server.
2. **Personal Access Token (PAT)** – create a GitHub PAT with the scopes you want the MCP server to expose. The following scopes cover the default toolset:
   - `repo`
   - `read:org`
   - `read:packages` (required to pull the server image from `ghcr.io`)
   - add additional scopes (issues, workflows, etc.) to unlock more toolsets as needed.

> Store the PAT securely (environment variable, secret manager, password vault). Never commit it to the repository.

## Starting the server in VS Code

1. Open this workspace in VS Code 1.101 or later.
2. Make sure Docker is running locally.
3. When Copilot prompts for MCP servers (or when you open the Model Context Protocol settings), point it to `.vscode/mcp.json` located in this repo.
4. When asked, paste your GitHub PAT. The configuration runs the official Docker image `ghcr.io/github/github-mcp-server` with your token injected through the `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable.

The server exits after each session (`--rm`), so the token is not persisted inside the container.

### Optional: using environment variables

Instead of typing the PAT each time, set an environment variable in your shell (e.g. `export GITHUB_MCP_PAT=ghp_...`) and replace the `"${input:github_mcp_pat}"` value in `.vscode/mcp.json` with `"${env:GITHUB_MCP_PAT}"`.

## Selecting toolsets

By default the server exposes the "context", "repos", "issues", "pull_requests" and "users" toolsets. To enable more APIs, set the environment variable `GITHUB_TOOLSETS` before launching the container, for example:

```json
{
  "servers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "-e",
        "GITHUB_TOOLSETS",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_mcp_pat}",
        "GITHUB_TOOLSETS": "repos,issues,pull_requests,actions"
      }
    }
  }
}
```

Consult the upstream [GitHub MCP Server README](https://github.com/github/github-mcp-server) for the full list of toolsets and additional configuration options (enterprise hosts, OAuth flows, building from source, etc.).

## Troubleshooting

- **`docker: command not found`** – confirm Docker is installed and its CLI is on your PATH.
- **Image pull fails** – run `docker logout ghcr.io` and `docker login ghcr.io` using a PAT with `read:packages` scope.
- **Permission errors when calling APIs** – ensure your PAT includes the scope required by the tool you are trying to use.
- **Host cannot find `.vscode/mcp.json`** – some IDEs expect the file without the `.vscode/` prefix. Copy the JSON snippet into the host's MCP settings if necessary.
