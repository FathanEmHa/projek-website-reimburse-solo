import 'package:flutter/material.dart';

import 'package:mobile_app/app/theme/app_colors.dart';
import 'package:mobile_app/app/utils/assets.dart';
import 'package:mobile_app/features/auth/presentation/widgets/login_form.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: AppGradients.backgroundBody,
        ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 30),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 20),
              Image.asset(AppAssets.logoFull, width: 420),
              const LoginForm(),
              const SizedBox(height: 47),
              Image.asset(AppAssets.logoIcon, width: 200),
              const SizedBox(height: 85),
              const Text(
                "Kesulitan login? Hubungi HRD atau IT Support",
                style: TextStyle(
                  fontFamily: 'Manrope',
                  fontSize: 12,
                  color: AppColors.textSecondaryLight, // sementara
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
      ),
    );
  }
}