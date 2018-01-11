/**
 * Parse the remote user object into a local one.
 */
module.exports.parse = function(json) {
  const profile = {};

  profile.id = json.user_id;

  return profile;
};
