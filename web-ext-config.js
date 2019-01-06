module.exports = {
  sourceDir: "src",
  artifactsDir: "dist",
  build: {
    overwriteDest: true,
  },
  run: {
    firefox: "nightly",
    startUrl: ["about:debugging"],
    pref: [
      // Allow accessing about:config without the warning screen.
      "general.warnOnAboutConfig=false",
      // Hide info/hint/intro bars/popups.
      "datareporting.policy.dataSubmissionPolicyBypassNotification=true",
      "browser.urlbar.timesBeforeHidingSuggestionsHint=0",
      "browser.contentblocking.introCount=20",
    ],
  },
};
