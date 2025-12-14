import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:mobile_app/app/config/app_config.dart';
import 'package:mobile_app/core/error/api_exception.dart';

class AuthServices {
  final http.Client client;
  AuthServices({required this.client});

  Future<Map<String, dynamic>> login(String email, String password) async {
    final uri = Uri.parse("${AppConfig.baseUrl}/login");

    final res = await client.post(
      uri,
      body: {
        "email": email,
        "password": password,
      },
    );

    final body = jsonDecode(res.body);
    if (res.statusCode == 200) {
      return body;
    } else {
      final message = body['message'] ?? 'Login Failed';
      throw ApiException(message: message, statusCode: res.statusCode);
    }
  }
}