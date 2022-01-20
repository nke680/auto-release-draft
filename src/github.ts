import * as version from './version'
const github = require('@actions/github')
const core = require('@actions/core')
import * as markdown from './markdown'

export async function createReleaseDraft(
  versionTag: string,
  repoToken: string,
  changeLog: string
): Promise<string> {
  const octokit = new github.getInput(repoToken)

  const response = await octokit.repos.createRelease({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag_name: versionTag, // eslint-disable-line @typescript-eslint/camelcase
    name: version.removePrefix(versionTag),
    body: markdown.toUnorderedList(changeLog),
    prerelease: version.isPrerelease(versionTag),
    draft: true
  })

  if (response.status != 201) {
    throw new Error(`Failed to create the release: ${response.status}`)
  }

  core.info(`Created release draft ${response.data.name}`)

  return response.data.html_url
}
