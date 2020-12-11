title: Merge Day Automation
slug: mergedayautomation
date: 2020-12-11 20:05:37 UTC
type: text

# Overview

Merge day happens at 4-week intervals (most of the time), and follows the
Firefox Rapid Release schedule. This document only covers merge activities,
not the related releases that happen on the same day.

On Merge day:

* Communication about the merges
* Merge comm-central to comm-beta
* Tag and bump comm-central versions
* Update ShipIt nightly version

# Communication

This section needs to be written still.

# Steps

Make sure you are logged into Treeherder. You will need to have
"thunderbird-releng" permissions, which are set in
[Taskcluster](https://hg.mozilla.org/ci/ci-configuration/file/1d37a3cf95a4e272eeaa7a910193e58ff2028646/grants.yml#l2415).

Close the trees in [TreeStatus](https://treestatus.mozilla-releng.net/).

## comm-central -> comm-beta

1. In Treeherder, select the comm-central repository
1. Select the Decision task of the latest push
1. Click the down arrow in the top right corner and select "Custom push action..."
1. Choose "merge-automation"
1. Update the payload (note that with `force-dry-run` set to `true`, the value of
   `push` is ignored)
    ```YAML
    behavior: comm-central-to-beta
    force-dry-run: true
    push: true
    ```
1. Trigger!

If the dry-run is successful, run it again, this time setting `force-dry-run` to
`false`.

## Bump Nightly version

1. Select comm-central repository in Treeherder and select the "merge-automation"
   custom action as above
1. Update the payload
   ```YAML
   behavior: comm-bump-central
   force-dry-run: true
   push: true
   ```
1. Trigger!

If the dry-run is successful, run again without `force-dry-run`.

## Bump Release version

1. Select comm-esr78 repository and select the "merge-automation" custom action
1. Update the payload
   ```YAML
   behavior: comm-bump-esr
   force-dry-run: true
   push: true
   ```
1. Trigger!

_Note_: This is currently set to bump comm-esr78. When there are two release
versions (such as 78.x and 91.x) this will need to run twice, overriding
`to-branch` and `to-repo` on one of the runs.

```YAML
behavior: comm-bump-esr
force-dry-run: true
push: true
to-branch: comm-esr78
to-repo: https://hg.mozilla.org/releases/comm-esr78
```

# What's not documented here (yet)

* Bump the suite versions. Refer to
  [bug 1619767 comment 38](https://bugzilla.mozilla.org/show_bug.cgi?id=1619767#c38)
  for how this should be done. This will be added to automation later.
* Updating `.gecko_rev.yml`. This file will be obsoleted as part of the one-repo
  project. For now, update by hand prior to starting a release.
* Communication. It needs to be similar to what has been sent in the past, but
  update the list of steps and refer to this document.
* Update Shipit. Refer to the old documentation on the wiki for what to do.
