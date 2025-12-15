import 'package:get/get.dart';

import 'package:mobile_app/core/network/api_client.dart';
import 'package:mobile_app/core/services/auth_services.dart';
import 'package:mobile_app/features/auth/data/auth_repository.dart';
import 'package:mobile_app/features/auth/logic/auth_controller.dart';

class AuthBinding extends Bindings {
  @override
  void dependencies() {
    // Lapisan paling bawah - Network layer
    Get.lazyPut<ApiClient>(() => ApiClient());

    // Service layer
    Get.lazyPut<AuthServices>(
      () => AuthServices(apiClient: Get.find<ApiClient>()),
    );

    // Repository layer
    Get.lazyPut<AuthRepository>(
      () => AuthRepository(client: Get.find<AuthServices>()),
    );

    // Controller layer - Lapisan paling atas
    Get.lazyPut<AuthController>(
      () => AuthController(repository: Get.find<AuthRepository>()),
    );
  }
}