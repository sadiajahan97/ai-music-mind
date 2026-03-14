import 'package:flutter/material.dart';
import '../widgets/bottom_nav_bar.dart';
import '../models/music_track.dart';
import 'home_screen.dart';
import 'library_screen.dart';
import 'now_playing_screen.dart';
import 'profile_screen.dart';
import 'create_song_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  MusicTrack? _currentTrack;
  List<MusicTrack> _currentPlaylist = [];
  bool _shouldPlay = false;

  void _playTrack(MusicTrack track, List<MusicTrack> playlist) {
    setState(() {
      _currentTrack = track;
      _currentPlaylist = playlist;
      _currentIndex = 2; // Index of NowPlayingScreen
      _shouldPlay = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> _screens = [
      const HomeScreen(),
      LibraryScreen(
        onTrackSelected: _playTrack,
        onTracksLoaded: (tracks) {
          if (_currentTrack == null && tracks.isNotEmpty) {
            setState(() {
              _currentTrack = tracks.first;
              _currentPlaylist = tracks;
              _shouldPlay = false; // Do not auto play default track
            });
          }
        },
      ),
      NowPlayingScreen(
        track: _currentTrack,
        playlist: _currentPlaylist,
        autoPlay: _shouldPlay,
        onTrackChanged: (track) {
          setState(() {
            _currentTrack = track;
            _shouldPlay = true; // Play when track changes (e.g. Skip Next)
          });
        },
      ),
      const ProfileScreen(),
    ];
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() => _currentIndex = index);
        },
        onFabPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CreateSongScreen()),
          );
          if (result is int && result >= 0) {
            setState(() => _currentIndex = result);
          }
        },
      ),
    );
  }
}
