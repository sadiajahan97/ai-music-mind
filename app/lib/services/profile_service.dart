import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants.dart';
import '../models/auth_response.dart';
import 'auth_service.dart';

class ProfileService {
  Future<User?> getProfile() async {
    final token = await AuthService().getToken();
    if (token == null) return null;

    final response = await http.get(
      Uri.parse('${AppConstants.baseUrl}/profile/'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return User.fromJson(jsonDecode(response.body));
    } else {
      return null;
    }
  }
}
