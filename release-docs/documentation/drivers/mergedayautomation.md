title: Merge Day Automation
slug: mergedayautomation
date: 2020-12-11 20:05:37 UTC
type: text

# Deprecated

With monthly releases coming, see [Merge Duty](../merge_duty) for current tasks.
This file is kept for historical purposes.

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

Send emails to both [thunderbird-drivers](mailto:thunderbird-drivers@mozilla.org) and 
[tb-sheriffs](mailto:sheriffs@thunderbird.net) list with information about the merge
and status updates. Templates are [here](../mergeday_email_templates).

# Steps

Make sure you are logged into Treeherder. You will need to have
"thunderbird-releng" permissions, which are set in
[Taskcluster](https://hg.mozilla.org/ci/ci-configuration/file/1d37a3cf95a4e272eeaa7a910193e58ff2028646/grants.yml#l2415).

Close the `comm-central` and `comm-beta` trees in
[TreeStatus](https://lando.services.mozilla.com/treestatus/).

## comm-central -> comm-beta

1. In Treeherder, select the comm-central repository
1. Select the Decision task of the latest push
1. Click the down arrow in the top right corner and select "Custom push action..."
1. Choose "merge-automation"
1. Update the payload & trigger (note that with `force-dry-run` set to `true`, the value of
   `push` is ignored)
   
```yaml
behavior: comm-central-to-beta
force-dry-run: true
push: true
```

If the dry-run is successful, run it again, this time setting `force-dry-run` to
`false`.

### Update .gecko_rev.yml

The automation will pin to mozilla-beta@default. This will build. A specific
revision needs to be pinned manually before releasing beta 1.

### Suite version

The automation will change 2.XXa1 to 2.XXb1.

## Bump Daily version

1. Select comm-central repository in Treeherder and select the "merge-automation"
   custom action as above
1. Update the payload & trigger
   
```yaml
behavior: comm-bump-central
force-dry-run: true
push: true
```

If the dry-run is successful, run again without `force-dry-run`.

**Note regarding suite version bump:** This is now handled by automation so no
manual step is necessary.

# Update Ship-It

Mozilla's [Ship-It](https://github.com/mozilla-releng/shipit) tool must be
updated with the new Daily version number.

## Changes

* Modify `api/src/shipit_api/common/config.py` and update the
  `LATEST_THUNDERBIRD_NIGHTLY_VERSION` variable to be the new version of
  comm-central.
* Create a pull request with the changes. [Example](https://github.com/mozilla-releng/shipit/pull/1004)
  * In the pull request, @mention one of the Ship-It code owners to make sure
    the request is seen. You can also say something in #releaseduty on Matrix.

If you are not familiar with Github's Fork & Pull workflow model,
see [here](https://reflectoring.io/github-fork-and-pull/) for an introduction.

# Check for Firefox Beta tag

The build tag for the corresponding Firefox beta release may or may not have
been set yet. Check `mozilla-beta` for a tag like `FIREFOX_major_0b1_BUILD1`
where "major" is the new beta version.

If there is a tag, on a local "comm-beta" checkout: 
- run `pin_for_release.py mozilla-beta`.
- `hg amend -e` and add "CLOSED TREE" to the end of the first line of the
    commit message.
  - ex: `No bug - Pin mozilla-beta (FIREFOX_106_0b1_BUILD1/4f39db81f6e). r=release a=rjl CLOSED TREE`
- Push to comm-beta.

If the Firefox `BUILD1` tag has not been set, proceed with opening the trees
and the conclusion email, but remember to run `pin_for_release.py` prior to
promoting the Thunderbird Beta.

# Open Trees & Conclusion Email

If the builds running on `comm-central` and `comm-beta` look good, re-open
the trees. If there's a build or decision task failure, handle that before
opening the trees in TreeStatus.

Use the [Conclusion Email template](../mergeday_email_templates) to notify
thunderbird-drivers that the work is complete.

# Test runs with a real push

You can push to `try-comm-central` with to-repo/from-repo to test that pushing
actually works, though it really shouldn't break now that it's working.

# to-repo, from-repo, to-branch, from-branch?

It's kind of confusing...

* to-branch and from-branch are Firefoxtree "branch" names, and correspond
  to "branches" of code for release purposes
* **to-repo** in a merge context is the URL of the destination repository you
  want to merge into. So for comm-central-to-beta, that's the _full URL_ (https)
  of comm-beta on hg.m.o.
* **from-repo** then is the repo URL you are merging into to-repo. So, comm-central's
  URL.
* **VERY IMPORTANT** Merge day work will push to both `to-repo` and `from-repo`.
  So if you are testing push stuff, make sure to set both to `try-comm-central`'s
  URL.
