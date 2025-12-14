import 'package:flutter/material.dart';

class AppColors {
  // light mode
  static const Color primaryLight = Color(0xFF00B8D4);
  static const Color backgroundLight = Color(0xEBFFFFFF);
  static const Color surfaceLight = Color(0xFFF5F7FA);
  static const Color textPrimaryLight =  Color(0xFF000000);
  static const Color textSecondaryLight = Color(0xE6000000);

  // dark mode
  static const Color primaryDark = Color(0xFF00B8D4);
  static const Color backgroundDark = Color(0xFF121212);
  static const Color surfaceDark = Color(0xFF1E1E1E);
  static const Color cardDark = Color(0xFF0E0E0E);
  static const Color textPrimaryDark = Color(0xFFFFFFFF);
  static const Color textSecondaryDark = Color(0xB3FFFFFF);
  // border
}

class AppBadge {
  
}

class AppGradients {
  static const backgroundBody = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      Color(0xFFF6F8FF),
      Color(0xFFD9DEFF),
      Color(0xFFD6DAFF),
      Color(0xFFB0B9FF),
    ],
    stops: [0.0, 0.27, 0.51, 0.79],
  );
}