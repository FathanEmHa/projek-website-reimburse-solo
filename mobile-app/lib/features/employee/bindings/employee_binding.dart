import 'package:get/get.dart';
import 'package:mobile_app/features/employee/logic/employee_controller.dart';

class EmployeeBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<EmployeeController>(
      () => EmployeeController(),
    );
  }
}