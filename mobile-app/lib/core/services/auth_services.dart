import 'package:mobile_app/core/network/api_client.dart';
import 'package:mobile_app/core/network/endpoints.dart';

class AuthServices {
  final ApiClient _apiClient;

  AuthServices({required ApiClient apiClient}) : _apiClient = apiClient;

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _apiClient.post(
      ApiEndpoints.login,
      data: {
        "email": email,
        "password": password,
      },
    );

    return response.data as Map<String, dynamic>;
  }
}