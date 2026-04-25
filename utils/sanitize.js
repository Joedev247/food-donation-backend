function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || undefined,
    organizationType: user.organizationType || undefined,
    address: user.address || undefined,
    createdAt: user.createdAt?.toISOString(),
  };
}

module.exports = { sanitizeUser };
