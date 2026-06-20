const inviteCodeGen = () => {
  return crypto.randomUUID().split("-").slice(0, 2).join("").toUpperCase();
};
// console.log(inviteCodeGen());

module.exports = inviteCodeGen;
