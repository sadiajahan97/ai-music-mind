import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants.dart';
import '../models/music_track.dart';
import 'auth_service.dart';

class MusicService {
  final AuthService _authService = AuthService();

  Future<List<MusicTrack>> getMusicTracks() async {
    final token = await _authService.getToken();
    if (token == null) {
      throw Exception('Not authenticated');
    }

    final response = await http.get(
      Uri.parse('${AppConstants.baseUrl}/music/tracks'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => MusicTrack.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load music tracks');
    }
  }

  Future<Map<String, dynamic>> generateMusic({
    required String userPrompt,
    required String style,
    required String vocalGender,
    required double styleWeight,
    required double weirdnessConstraint,
    required String language,
  }) async {
    final token = await _authService.getToken();
    if (token == null) {
      throw Exception('Not authenticated');
    }

    final response = await http.post(
      Uri.parse('${AppConstants.baseUrl}/music/generate'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'user_prompt': userPrompt,
        'style': style,
        'vocal_gender': vocalGender,
        'language': language,
        'style_weight': styleWeight,
        'weirdness_constraint': weirdnessConstraint,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['detail'] ?? 'Failed to generate music');
    }
  }
}
