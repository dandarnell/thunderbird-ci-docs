title: Merge Duty
slug: merge_duty
date: 2023-12-08 16:04:40 UTC
type: text

# Merge Duty

!!! attention

    This file replaces [Merge Day Automation](../mergedayautomation) which is kept for
    historical purposes.


All code changes to Thunderbird land in the
[comm-central](https://hg.mozilla.org/comm-central) repository

- The `Daily` releases are built from that repo once a day.
- `Beta` releases are built from the [comm-beta](https://hg.mozilla.org/releases/comm-beta/)
  repository
- `Release` is built from [comm-release](https://hg.mozilla.org/releases/comm-release/)
  repository
- `Extended Support Releases` from the relevant ESR repo, such as
  [comm-esr115](https://hg.mozilla.org/releases/comm-esr115/)

**The *merge* in *Merge Duty* refers to the `comm-beta-to-release` merge. All dates
referenced below are relative to *Merge Day*, which is 1 week before the
traditional Thunderbird merge-day, now known as *version bump day*.

## Email templates

See [Merge Email Templates](mergeday_email_templates) for the email templates.
  
## Overview of Procedure

- Prep work a week before the merge
    - [Do migration no-op trial runs](#do-migration-no-op-trial-runs)
- On Merge day:
    - [Merge beta to release](#merge-beta-to-release)
- On Version Bump day, one week later:
    - [Merge central to beta](#merge-central-to-beta)
    - [Tag central and bump versions](#tag-central-and-bump-versions)
    - [Bump mozilla-esr](#bump-esr-version)
    - [Bump Daily version in ShipIt](#bump-nightly-shipit)


## Trial runs, one week prior to merge

!!! important

    Doing a no-op trial run of each migration ensures that the migrations themselves
    work prior to Merge day.

#### General steps

1. Go to
   [Treeherder](https://treeherder.mozilla.org/).
2. Select the repo depending on the merge you want to perform (comm-central,
   comm-beta or comm-esrZZ).
3. On the latest push, click on the down arrow in the top right corner.
4. Select “Custom push action…”
5. Choose `merge-automation`
6. In Treeherder, you'll see a new push show up in Treeherder in the repo you
   will be merging to. It can take a few minutes for the push and task to appear.
7. Click on the merge or bump tasks (not the Gecko decision task). A job details
   panel will pop up and from there you'll find a link to the diff file in the
   artifacts tab. Note: There will be a cron job that kicks off another bump task
   with the same name, only one of them will contain the diff.

#### comm-beta->comm-release migration no-op trial run

1. Follow the [general steps](#general-steps) hopping on
   [comm-beta](https://treeherder.mozilla.org/#/jobs?repo=comm-beta)
2. Insert the following payload and click submit.

```yaml
behavior: comm-beta-to-release
force-dry-run: true
push: true
```

#### comm-central->comm-beta migration no-op trial run

1. Follow the [general steps](#general-steps) hopping on
   [comm-central](https://treeherder.mozilla.org/#/jobs?repo=comm-central)
2. Insert the following payload and click submit.

```yaml
behavior: comm-central-to-beta
force-dry-run: true
push: true
```

#### comm-esr bump no-op trial run

comm-esr branches evolve over time: comm-esr115 is the current esr, and that is
used in the discussion below; in the future, you may need to substitute a
different esr version number.

1. Follow the [general steps](#general-steps) hopping on
   [comm-esr115](https://treeherder.mozilla.org/#/jobs?repo=comm-esr115)
2. Insert the following payload and click submit.

```yaml
behavior: comm-bump-esr115
force-dry-run: true
push: true
```

## Release Merge Day - part I

**When**: The release merge must happen after Firefox has merged mozilla-beta
to mozilla-release. 
For date, see [Firefox Release Scheduling
calendar](https://calendar.google.com/calendar/embed?src=bW96aWxsYS5jb21fZGJxODRhbnI5aTh0Y25taGFiYXRzdHY1Y29AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ).

### Merge comm-beta to comm-release

1. Email [thunderbird-drivers](mailto:thunderbird-drivers@mozilla.org)  that the merge is beginning using the
   template.
1. Close comm-beta in [Treestatus](https://lando.services.mozilla.com/treestatus/).
   Check *“Remember this change to undo later”*. Please enter a good
   message as the reason for the closure, such as “Mergeduty - closing
   beta for \$VERSION RC week”.
2. Run the `comm-beta -> comm-release` [no-op trial
   run](#do-migration-no-op-trial-runs) one more time and verify the diff looks
   correct.
4. Submit a new task with `force-dry-run` set to false:
```yaml
behavior: comm-beta-to-release
force-dry-run: false
push: true
```  

!!! warning

    If an issue comes up during this phase, you may not be able to run
    this command (or the no-op one) correctly. You may need to publicly
    backout some tags/changesets to get back in a known state.

5. Upon successful run, ``comm-release`` should get a version bump,
   branding changes, and two new tags. The first tag should be
   in the form `RELEASE_xxx_END` - where the xxx is the previous major version.
   The other tag should be in the form `RELEASE_yyy_BASE` - where the yyy is the
   new major version.
6. .gecko_rev.yml should have been modified to pin to the correct tag and rev on
   mozilla-release.
2. At the same time `comm-beta` should get a tag in the form `RELEASE_xxx_BASE`
   \- where the xxx is the previous major beta version.


### Email thunderbird-drivers 

Reply to the first email that the merge is complete using the template.


## Release Merge Day - part II - a week after Merge day

**When**: The release merge must happen after Firefox has merged mozilla-central
to mozilla-beta. 

### Merge central to beta

1. Email [thunderbird-drivers](mailto:thunderbird-drivers@mozilla.org) and [tb-sheriffs](mailto:sheriffs@thunderbird.net)
   that the merge is beginning using the template.
2. Close `comm-central` in [TreeStatus](https://lando.services.mozilla.com/treestatus/).
1. Run the `comm-central -> comm-beta` [no-op trial
   run](#do-migration-no-op-trial-runs) one more time, and verify the diff looks
   correct.
3. Submit a new task with `force-dry-run` set to false:

```yaml
behavior: comm-central-to-beta
force-dry-run: false
push: true
```

5. Upon a successful run, `comm-beta` should get a version bump, branding changes,
   and two new tags: `BETA_xxx_END` and `BETA_yyy_BASE`. .gecko_rev.yml is **not**
   pinned to the correct tag/revision. This should be done prior to building the
   new beta version.

   Click the first HG revision link (left side under date and timestamp) for the merge push to verify this.

2. Verify that `mail/locales/l10n-changesets.json` has revisions, not
   `default`.
3. At the same time `comm-central` should get a new tag `BETA_xxx_BASE`.

!!! warning

    Be sure to pin .gecko_rev.yml to mozilla-beta's BUILD1 tag prior to promoting
    the beta 1 build.

!!! warning

    The merge day automation may not be idempotent.
    The merge automation task may fail and auto-retry (because of a worker
    shutdown, for instance).
    If the task retries after updating the state of the repo, it will update
    the state of the repo again, pushing repeated commits.


### Re-opening beta

Restore comm-beta tree in [TreeStatus](https://lando.services.mozilla.com/treestatus/)
to its previous state (`approval-required`) so that **l10n bumper can run**.


### Tag comm-central and bump versions

**What happens**: A new tag is needed to specify the end of the nightly
cycle and bump versions in `comm-central`.

1. Follow the [general steps](#general-steps)
2. Insert the following payload and click submit.

```yaml
behavior: comm-bump-central
force-dry-run: false
push: true
```

3. Upon successful run, `comm-central` should get a version bump commit and a
   new tag `NIGHTLY_xxx_END`.

### Bump ESR version

!!! note

    You could have one ESR to bump, or two. If you are not sure, ask.

Run the comm-bump-esr115 [no-op trial run](#do-migration-no-op-trial-runs)
one more time, and verify the output.


Push your changes generated by the no-op trial run:

1. Follow the [general steps](#general-steps)
2. Insert the following payload and click submit.

```yaml
behavior: comm-bump-esr115
force-dry-run: false
push: true
```

!!! note
    
    The esr version is currently hardcoded to the action; If necessary, an action for other esr
    versions can be added to `taskcluster/ci/config.yml`.

3. Upon successful run, `mozilla-esr${VERSION}` should get a version bump commit.

### Reply to thunderbird-drivers that version bump completed

Reply to the migration request with the template.

### Bump Nightly version and release dates in ShipIt

In ShipIt, the Thunderbird nightly version is hard-coded, and must be updated
after the version bump on comm-central.

Follow these steps to bump the nightly version and release dates in ShipIt:

* Modify `api/src/shipit_api/common/config.py` and update the
  `LATEST_THUNDERBIRD_NIGHTLY_VERSION` variable to be the new version of
  comm-central.
* Create a pull request with the changes. [Example](https://github.com/mozilla-releng/shipit/pull/1004)
  * In the pull request, @mention one of the Ship-It code owners to make sure
    the request is seen. You can also say something in #releaseduty on Matrix.

If you are not familiar with Github's Fork & Pull workflow model,
see [here](https://reflectoring.io/github-fork-and-pull/) for an introduction.

