import 'package:get/get.dart';

import 'package:mobile_app/app/routes/app_routes.dart';
import 'package:mobile_app/features/auth/bindings/auth_binding.dart';
import 'package:mobile_app/features/auth/presentation/pages/login_page.dart';
import 'package:mobile_app/features/employee/presentation/pages/employee_dashboard.dart';

class AppPages {
  AppPages._();

  static final routes = <GetPage>[
    GetPage(
      name: Routes.login,
      page: () => LoginPage(),
      binding: AuthBinding(),
      // middleware
      transition: Transition.fadeIn,
    ),
    GetPage(
      name: Routes.dashboard,
      page:() => EmployeeDashboard(),
      // middleware
      transition: Transition.fadeIn,
    ),
  ];
}