import 'package:dio/dio.dart';
import 'package:mobile_app/app/config/app_config.dart';
import 'package:mobile_app/core/error/api_exception.dart';

class ApiClient {
  final Dio _dio;
  final baseUrl = AppConfig.baseUrl;

  ApiClient({required String baseUrl, Map<String, dynamic>? defaultHeaders})
  : _dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    headers: defaultHeaders ?? {'Content-Type': 'application/json'},
    connectTimeout: const Duration(milliseconds: 15000),
    receiveTimeout: const Duration(milliseconds: 15000),
  )) {
    _dio.interceptors.add(InterceptorsWrapper(
      onError: (e, handler) {
        final msg = e.response?.data?.toString() ?? e.message ?? 'Unknown error';
        handler.reject(
          DioException(
            requestOptions: e.requestOptions,
            error: ApiException(message: msg, statusCode: e.response?.statusCode),
            response: e.response,
            type: e.type,
          ),
        );
      },
    ));
  }

  Future<Response> get(String path, {Map<String, dynamic>? queryParameters, Options? options}) async {
    try {
      final res = await _dio.get(path, queryParameters: queryParameters, options: options);
      return res;
    } on DioException catch (e) {
      if (e.error is ApiException) throw e.error as ApiException;
      throw ApiException(message: e.message ?? 'Unknown error', statusCode: e.response?.statusCode);
    } catch (e) {
      throw ApiException(message: e.toString());
    }
  }

  Future<Response> post(String path, {dynamic data, Map<String, dynamic>? queryParameters, Options? options}) async {
    try {
      final res = await _dio.post(path, data: data, queryParameters: queryParameters, options: options);
      return res;
    } on DioException catch (e) {
      if (e.error is ApiException) throw e.error as ApiException;
      throw ApiException(message: e.message ?? 'Unknown error', statusCode: e.response?.statusCode);
    } catch (e) {
      throw ApiException(message: e.toString());
    }
  }
}