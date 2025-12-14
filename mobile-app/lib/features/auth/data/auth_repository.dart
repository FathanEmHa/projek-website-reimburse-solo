import 'package:mobile_app/core/services/auth_services.dart';
import 'package:mobile_app/core/storage/token_manager.dart';
import 'package:mobile_app/features/auth/data/models/login_response.dart';

class AuthRepository {
  final AuthServices _services;

  AuthRepository({required AuthServices client}) : _services = client;

  Future<LoginResponse> login(String email, String password) async {
    final raw = await _services.login(email, password);

    final data = LoginResponse.fromJson(raw);

    await TokenManager.saveToken(data.token);

    return data;
  }
}