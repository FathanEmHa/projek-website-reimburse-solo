class LoginResponse {
  final String token;
  final String name;

  LoginResponse({required this.token, required this.name});

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    final token = (json['access_token'] as String?) ?? (json['access_token'] as String?);
    final name = (json['user']?['name'] as String?) ?? (json['name'] as String?) ?? '';

    if (token == null) {
      throw FormatException('LoginResponse: access_token is null');
    }

    return LoginResponse(token: token, name: name);
  }
}