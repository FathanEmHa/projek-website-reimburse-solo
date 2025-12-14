import 'package:flutter/material.dart';
import 'package:mobile_app/app/theme/app_colors.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;

  const CustomButton({
    super.key,
    required this.text,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context)  {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.textPrimaryLight,
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 138),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
      ),
      child: Text(
        text,
        style: const TextStyle(color: AppColors.textPrimaryDark),
      ),
    );
  }
}