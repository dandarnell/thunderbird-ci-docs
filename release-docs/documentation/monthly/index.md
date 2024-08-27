title: Monthly Release Notes
slug: index
date: 2024-08-27 13:46:18 UTC
type: text

# Building a Monthly RC release

- Merge comm-beta to comm-release as described in Merge Automation docs
- **Stop the build on comm-release**
- Apply [the start page patch](/misc/monthly_rc_start_page.patch) to comm-release
- Make sure that .gecko_rev.yml is pinned in a sane manner
- Push, Build, Promote...
