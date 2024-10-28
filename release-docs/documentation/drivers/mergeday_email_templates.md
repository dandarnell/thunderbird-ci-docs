title: Merge Day Emails
slug: mergeday_email_templates
date: 2021-11-01 14:24:25 UTC
type: text
template: emails.tmpl

The date and version numbers will be correct assuming this page is loaded
prior to starting the actual merge work. Proofread and verify prior to hitting
Send.

# Comm-Beta/Comm-Central Announcement Email

_Send this email the morning of the merge._

---

**Subject:** Thunderbird beta merge & version bumps for {{% today %}} (c-c -> {{% milestone nightly %}} 
/ c-b -> {{% milestone beta %}})

Hello!

I'll be completing the Thunderbird beta merge today. The Firefox merges 
**have <span id="ff_merge_negate">not</span>** completed.

* comm-central is going to version {{% milestone nightly %}}
* comm-beta to {{% milestone beta %}}
* comm-release to {{% milestone release %}}

The merge will be performed via automation.

I’ll keep people up to date by replying to this email:

  * Email before merge begins
  * Close the trees
  * Perform the merge
  * Email after the merge
  * Re-open comm-central, set comm-beta to approval needed

Please let me know if you have any questions or comments.

Thanks,

---

# Conclusion Email

_Send this email after you've completed the work._

---

**Merges are finished.**

Thunderbird {{% milestone beta %}}beta1 will be built once the Firefox build has
been tagged in Mercurial.

comm-release:

  * **TREEHERDER LINK**

comm-beta:

  * **TREEHERDER LINK**

comm-central:

  * **TREEHERDER LINKS (2)**

documentation:

  * No changes

current tree status:

  * comm-release: <span style="weight:900; color:#f0ad4e">APPROVAL REQUIRED</span>
  * comm-beta: <span style="weight:900; color:#f0ad4e">APPROVAL REQUIRED</span>
  * comm-central: <span style="weight:900; color:#5cb85c">OPEN</span>

---
