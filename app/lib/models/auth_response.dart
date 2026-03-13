class AuthResponse {
  final String accessToken;
  final DateTime expiresAt;
  final User user;

  AuthResponse({
    required this.accessToken,
    required this.expiresAt,
    required this.user,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      accessToken: json['access_token'],
      expiresAt: DateTime.parse(json['expires_at']),
      user: User.fromJson(json['user']),
    );
  }
}

class User {
  final String id;
  final String email;
  final String name;
  final bool isPremium;

  User({
    required this.id,
    required this.email,
    required this.name,
    required this.isPremium,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      name: json['name'],
      isPremium: json['is_premium'],
    );
  }
}
