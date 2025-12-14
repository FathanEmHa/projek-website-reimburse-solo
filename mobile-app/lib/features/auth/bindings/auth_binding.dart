import 'package:get/get.dart';
import 'package:http/http.dart' as http;

import 'package:mobile_app/core/services/auth_services.dart';
import 'package:mobile_app/features/auth/data/auth_repository.dart';
import 'package:mobile_app/features/auth/logic/auth_controller.dart';

class AuthBinding extends Bindings {
  @override
  void dependencies() {
    // Lapisan paling bawah
    Get.lazyPut<http.Client>(() => http.Client());
    Get.lazyPut<AuthServices>(() => AuthServices(client: Get.find<http.Client>()));

    // Repository
    Get.lazyPut<AuthRepository>(
      () => AuthRepository(client: Get.find<AuthServices>()),
    );

    // Lapisan paling atas
    Get.lazyPut<AuthController>(
      () => AuthController(repository: Get.find<AuthRepository>()),
    );
  }
}