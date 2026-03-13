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
}
