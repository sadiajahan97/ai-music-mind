import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../widgets/menu_bottom_sheet.dart';

class LibraryScreen extends StatefulWidget {
  const LibraryScreen({super.key});

  @override
  State<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends State<LibraryScreen> {
  int _selectedTab = 0;

  final List<Map<String, dynamic>> _songs = [
    {
      'title': 'Stellar Resonance',
      'version': 'v4.5-all',
      'model': 'AI Master',
      'duration': '3:45',
      'color': const Color(0xFF0F1B2D),
    },
    {
      'title': 'Digital Horizon',
      'version': 'v4.2-vocal',
      'model': 'Generation 9',
      'duration': '4:12',
      'color': const Color(0xFF2D1B4E),
    },
    {
      'title': 'Midnight Neural',
      'version': 'v4.5-all',
      'model': 'Synthesized',
      'duration': '2:58',
      'color': const Color(0xFF1A3A2E),
    },
    {
      'title': 'Algorithm Beat',
      'version': 'v3.0-full',
      'model': 'Classic',
      'duration': '5:20',
      'color': const Color(0xFF3D2B1E),
    },
    {
      'title': 'Quantum Echo',
      'version': 'v4.5-all',
      'model': 'Deep Learning',
      'duration': '3:15',
      'color': const Color(0xFF1E3A5F),
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Library'),
      ),
      body: Column(
        children: [
          // Search bar
          // Padding(
          //   padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          //   child: Container(
          //     decoration: BoxDecoration(
          //       color: AppTheme.surfaceWhite,
          //       borderRadius: BorderRadius.circular(12),
          //       border: Border.all(color: AppTheme.dividerColor),
          //     ),
          //     child: TextField(
          //       decoration: InputDecoration(
          //         hintText: 'Search in your library',
          //         prefixIcon: const Icon(
          //           Icons.search,
          //           color: AppTheme.textTertiary,
          //           size: 20,
          //         ),
          //         border: InputBorder.none,
          //         enabledBorder: InputBorder.none,
          //         focusedBorder: InputBorder.none,
          //         contentPadding: const EdgeInsets.symmetric(
          //           vertical: 14,
          //           horizontal: 12,
          //         ),
          //         hintStyle: GoogleFonts.inter(
          //           color: AppTheme.textTertiary,
          //           fontSize: 14,
          //         ),
          //       ),
          //     ),
          //   ),
          // ),
          // const SizedBox(height: 4),
          // Songs / Playlists tabs
          // Padding(
          //   padding: const EdgeInsets.symmetric(horizontal: 20),
          //   child: Row(
          //     children: [
          //       _buildTabButton('Songs', 0),
          //       const SizedBox(width: 24),
          //       _buildTabButton('Playlists', 1),
          //     ],
          //   ),
          // ),
          // const SizedBox(height: 8),
          // Song list
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              itemCount: _songs.length,
              separatorBuilder: (context, index) =>
                  const Divider(color: AppTheme.dividerColor, height: 1),
              itemBuilder: (context, index) =>
                  _buildSongItem(_songs[index]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabButton(String label, int index) {
    final isSelected = _selectedTab == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedTab = index),
      child: Column(
        children: [
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 15,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
              color: isSelected ? AppTheme.accentBlue : AppTheme.textTertiary,
            ),
          ),
          const SizedBox(height: 6),
          Container(
            height: 2.5,
            width: 40,
            decoration: BoxDecoration(
              color: isSelected ? AppTheme.accentBlue : Colors.transparent,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSongItem(Map<String, dynamic> song) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 14),
      child: Row(
        children: [
          // Album art
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: song['color'] as Color,
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Center(
              child: Icon(Icons.music_note, color: Colors.white54, size: 22),
            ),
          ),
          const SizedBox(width: 14),
          // Song info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  song['title'] as String,
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textDark,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '${song['version']} • ${song['model']}',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          // Duration
          Text(
            song['duration'] as String,
            style: GoogleFonts.inter(
              fontSize: 14,
              color: AppTheme.textSecondary,
            ),
          ),
          const SizedBox(width: 8),
          // More button
          // GestureDetector(
          //   onTap: () => showMenuBottomSheet(context, song['title'] as String),
          //   child: const Icon(
          //     Icons.more_vert,
          //     color: AppTheme.textTertiary,
          //     size: 20,
          //   ),
          // ),
        ],
      ),
    );
  }
}
