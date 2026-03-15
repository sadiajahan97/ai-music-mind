import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../widgets/menu_bottom_sheet.dart';
import '../models/music_track.dart';
import '../services/music_service.dart';

class LibraryScreen extends StatefulWidget {
  final Function(MusicTrack track, List<MusicTrack> playlist)? onTrackSelected;
  final Function(List<MusicTrack> tracks)? onTracksLoaded;

  const LibraryScreen({
    super.key,
    this.onTrackSelected,
    this.onTracksLoaded,
  });

  @override
  State<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends State<LibraryScreen> {
  final MusicService _musicService = MusicService();
  List<MusicTrack> _tracks = [];
  bool _isLoading = true;
  String? _error;
  Timer? _refreshTimer;

  @override
  void initState() {
    super.initState();
    _fetchTracks();
    _refreshTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      if (mounted) _fetchTracks();
    });
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    super.dispose();
  }

  Future<void> _fetchTracks() async {
    try {
      final tracks = await _musicService.getMusicTracks();
      if (mounted) {
        setState(() {
          _tracks = tracks;
          _isLoading = false;
        });
        if (widget.onTracksLoaded != null) {
          widget.onTracksLoaded!(tracks);
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _isLoading = false;
        });
      }
    }
  }

  String _formatDuration(int? ms) {
    if (ms == null || ms == 0) return '';
    final totalSeconds = (ms / 1000).floor();
    final minutes = (totalSeconds / 60).floor();
    final remainingSeconds = totalSeconds % 60;
    if (remainingSeconds == 0) {
      return '${minutes}m';
    }
    return '${minutes}m ${remainingSeconds}s';
  }

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
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                    ? Center(child: Text('Error: $_error'))
                    : _tracks.isEmpty
                        ? const Center(child: Text('No tracks found'))
                        : ListView.separated(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 20, vertical: 8),
                            itemCount: _tracks.length,
                            separatorBuilder: (context, index) => const Divider(
                                color: AppTheme.dividerColor, height: 1),
                            itemBuilder: (context, index) =>
                                _buildSongItem(_tracks[index]),
                          ),
          ),
        ],
      ),
    );
  }

  // Widget _buildTabButton(String label, int index) {
  //   final isSelected = _selectedTab == index;
  //   return GestureDetector(
  //     onTap: () => setState(() => _selectedTab = index),
  //     child: Column(
  //       children: [
  //         Text(
  //           label,
  //           style: GoogleFonts.inter(
  //             fontSize: 15,
  //             fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
  //             color: isSelected ? AppTheme.accentBlue : AppTheme.textTertiary,
  //           ),
  //         ),
  //         const SizedBox(height: 6),
  //         Container(
  //           height: 2.5,
  //           width: 40,
  //           decoration: BoxDecoration(
  //             color: isSelected ? AppTheme.accentBlue : Colors.transparent,
  //             borderRadius: BorderRadius.circular(2),
  //           ),
  //         ),
  //       ],
  //     ),
  //   );
  // }

  Widget _buildSongItem(MusicTrack track) {
    return GestureDetector(
      onTap: () {
        if (widget.onTrackSelected != null) {
          widget.onTrackSelected!(track, _tracks);
        }
      },
      behavior: HitTestBehavior.opaque,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 14),
        child: Row(
          children: [
            // Album art
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                gradient: (track.isReady && track.imageUrl != null)
                    ? null
                    : AppTheme.orangeGradient,
              ),
              child: (track.isReady && track.imageUrl != null)
                  ? Image.network(
                      track.imageUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) =>
                          Container(
                        decoration: const BoxDecoration(
                            gradient: AppTheme.orangeGradient),
                        child: const Center(
                          child:
                              Icon(Icons.music_note, color: Colors.white, size: 22),
                        ),
                      ),
                    )
                  : const Center(
                      child:
                          Icon(Icons.music_note, color: Colors.white, size: 22),
                    ),
            ),
          ),
          const SizedBox(width: 14),
          // Song info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  track.title,
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textDark,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  track.isReady
                      ? '${track.tags ?? 'Untagged'} • ${_formatDuration(track.duration)}'
                      : 'Processing...',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          // More button
          // GestureDetector(
          //   onTap: () => showMenuBottomSheet(context, track.title),
          //   child: const Icon(
          //     Icons.more_vert,
          //     color: AppTheme.textTertiary,
          //     size: 20,
          //   ),
          // ),
        ],
      ),
    ),
  );
}
}
