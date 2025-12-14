import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:mobile_app/app/theme/app_colors.dart';
import 'package:mobile_app/features/auth/logic/auth_controller.dart';
import 'package:mobile_app/shared/presentation/widgets/custom_button.dart';
import 'package:mobile_app/shared/presentation/widgets/custom_text_field.dart';

class LoginForm extends StatefulWidget {
  const LoginForm({super.key});

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final _formKey = GlobalKey<FormState>();
  // gunakan Get.find jika controller sudah di-bind di binding; Get.put kalau mau instantiate di sini
  final AuthController controller = Get.find<AuthController>();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    // validasi form
    if (!_formKey.currentState!.validate()) {
      if (kDebugMode) debugPrint('Form tidak valid!');
      return;
    }

    // hide keyboard
    FocusScope.of(context).unfocus();

    final email = emailController.text.trim();
    final password = passwordController.text;

    try {
      // panggil controller.login (asumsi return Future<void>)
      await controller.login(email, password);

      // kalau controller tidak menavigasi, bisa navigasi di sini.
      // Get.offAllNamed('/dashboard');

      if (kDebugMode) debugPrint('Login success for $email');
    } on Exception catch (e) {
      // tampilkan pesan error (bisa disesuaikan: error message dari API)
      Get.snackbar(
        'Login Gagal',
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
      );
      if (kDebugMode) debugPrint('Login error: $e');
    } catch (e) {
      Get.snackbar('Terjadi Kesalahan', 'Coba lagi nanti');
      if (kDebugMode) debugPrint('Unexpected error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          CustomTextField(
            label: "Email",
            hintText: "Masukkan email anda!",
            controller: emailController,
            keyboardType: TextInputType.emailAddress,
            prefixIcon: Icons.email,
            validator: (value) {
              if (value == null || value.isEmpty) return 'Email Wajib di isi!';
              if (!value.contains('@')) return 'Format email tidak valid';
              return null;
            },
          ),
          const SizedBox(height: 10),
          CustomTextField(
            label: "Password",
            hintText: "Masukkan password anda!",
            controller: passwordController,
            isPassword: true,
            keyboardType: TextInputType.visiblePassword,
            prefixIcon: Icons.password,
            validator: (value) {
              if (value == null || value.isEmpty) return 'Password wajib di isi!';
              if (value.length < 6) return 'Password Minimal berisikan 6 karakter';
              return null;
            },
          ),
          const SizedBox(height: 5),
          Align(
            alignment: Alignment.centerRight,
            child: Text(
              "Butuh Bantuan?",
              style: TextStyle(
                color: AppColors.textSecondaryLight,
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          const SizedBox(height: 35),

          // Gunakan Obx untuk listen isLoading di controller
          Obx(() {
            final loading = controller.isLoading.value;

            return CustomButton(
              text: loading ? "Wait" : "Login",
              onPressed: loading ? null : _submit,
            );
          }),
        ],
      ),
    );
  }
}
