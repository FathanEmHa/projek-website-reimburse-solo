class ApiEndpoints {
  ApiEndpoints._();

  // Auth endpoints
  static const String login = '/login';
  static const String logout = '/logout';
  static const String refreshToken = '/refresh-token';

  // Employee endpoints
  static const String employeeDashboard = '/employee/dashboard';
  static const String reimburseList = '/employee/reimbursements';
  static const String createReimburse = '/employee/reimbursements';

  // Manager endpoints
  static const String managerDashboard = '/manager/dashboard';
  static const String approvals = '/manager/approvals';

  // Finance endpoints
  static const String financeDashboard = '/finance/dashboard';
  static const String paymentVerification = '/finance/verifications';
}


