exports.removeMemberFromFamily = (family, memberId) => {
  const target = family.members.find(
    (m) => m.user && m.user._id.toString() === memberId,
  );

  if (target) {
    family.members.pull({ _id: target._id });
  }

  // Clean up any orphaned members (user was deleted) while we're here
  family.members = family.members.filter((m) => m.user);
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

exports.getAllowedViewerIds = (family, targetUserId) => {
  const targetIdStr = targetUserId.toString();
  const viewerIds = new Set([targetIdStr]); // you can always see your own location

  family.members.forEach((member) => {
    if (!member.user) return; // orphaned member safety check

    const memberId = member.user._id
      ? member.user._id.toString()
      : member.user.toString();

    const canView = (member.canViewLocationsOf || []).some(
      (id) => id.toString() === targetIdStr,
    );

    if (canView) {
      viewerIds.add(memberId);
    }
  });

  return Array.from(viewerIds);
};
