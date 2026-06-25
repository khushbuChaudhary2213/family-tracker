exports.removeMemberFromFamily = (family, memberId) => {
  family.members = family.members.filter(
    (m) => m.user._id.toString() !== memberId,
  );
};

exports.removeLocationPermission = (family, memberId) => {
  family.members.forEach((member) => {
    member.canViewLocationsOf = member.canViewLocationsOf.filter(
      (id) => id.toString() !== memberId,
    );
  });
};

exports.roleMembers = (family, role) => {
  return family.members.filter((m) => m.role === role);
};
