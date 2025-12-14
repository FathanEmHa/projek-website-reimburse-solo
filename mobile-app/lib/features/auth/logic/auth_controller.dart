import 'package:flutter/widgets.dart';
// ignore: depend_on_referenced_packages
import 'package:get/get.dart';
import 'package:mobile_app/features/auth/data/auth_repository.dart';

class AuthController extends GetxController {
  final AuthRepository _repo;

  AuthController({required AuthRepository repository}) : _repo = repository;

  var isLoading = false.obs;

  Future<void> login(String email, String password) async {
    try {
      isLoading.value = true;

      final data = await _repo.login(email, password);

      debugPrint("Welcome ${data.name}");

      Get.offAllNamed('/dashboard/employee');
    } catch (e) {
      debugPrint("Login Error: $e");
    } finally {
      isLoading.value = false;
    }
  }
}