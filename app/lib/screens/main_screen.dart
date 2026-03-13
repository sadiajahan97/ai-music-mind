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

  void _playTrack(MusicTrack track) {
    setState(() {
      _currentTrack = track;
      _currentIndex = 2; // Index of NowPlayingScreen
    });
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> _screens = [
      const HomeScreen(),
      LibraryScreen(onTrackSelected: _playTrack),
      NowPlayingScreen(track: _currentTrack),
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
        onFabPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CreateSongScreen()),
          );
        },
      ),
    );
  }
}
