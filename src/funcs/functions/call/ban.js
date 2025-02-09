module.exports = {
  name: "$ban",
  usage: "[userID;reason (optional);days(optional, default to 1 or put 0 to permanent);guildId(optional)]",
  description: "Ban a member with provided id (user ID) from provided id (Guild ID) for an optional number of days, or permanant.",
  code: async (d) => {
    const [userid,
      reason,
      days = 0,
      guildid = d.guild?.id] = d.data.splits;
    let guild = guildid === d.guild?.id ? d.guild : await d.client.guilds.cache.get(guildid);
    if (!guild) guild = await d.client.guilds.fetch(guildid, {
      force: true
    });
    if (!guild) return d.sendError(d, "Invalid provided guild id");
    let user = await guild.members.cache.get(userid);
    if (!user) user = await guild.members.fetch(userid, {
      force: true
    });
    if (!user) return d.sendError(d, "Invalid provided user id");
    if (isNaN(Number(days)) || Number(days) < 0 || Number(days) > 7) return d.sendError(d, "Invalid days");
    guild.bans.create(user.id, {
      days, reason: reason?.unescape()
    }).catch(e => {
      d.sendError(d, "Failed to ban user with reason: " + e)
    })
    return ""
  }
}
