import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:audioplayers/audioplayers.dart';
import '../theme/app_theme.dart';
import '../models/music_track.dart';
import '../services/auth_service.dart';
import '../constants.dart';

class NowPlayingScreen extends StatefulWidget {
  final MusicTrack? track;
  final List<MusicTrack>? playlist;
  final Function(MusicTrack)? onTrackChanged;

  const NowPlayingScreen({
    super.key,
    this.track,
    this.playlist,
    this.onTrackChanged,
  });

  @override
  State<NowPlayingScreen> createState() => _NowPlayingScreenState();
}

class _NowPlayingScreenState extends State<NowPlayingScreen>
    with SingleTickerProviderStateMixin {
  final AudioPlayer _player = AudioPlayer();
  final AuthService _authService = AuthService();
  
  bool _isPlaying = false;
  bool _isFavorited = true;
  double _progress = 0.0;
  Duration _position = Duration.zero;
  Duration _duration = Duration.zero;
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _initPlayer();
    if (widget.track != null) {
      _loadTrack(widget.track!);
    }
  }

  void _initPlayer() {
    _player.onPlayerStateChanged.listen((state) {
      if (mounted) {
        setState(() {
          _isPlaying = state == PlayerState.playing;
        });
      }
    });

    _player.onPositionChanged.listen((pos) {
      if (mounted) {
        setState(() {
          _position = pos;
          if (_duration.inMilliseconds > 0) {
            _progress = _position.inMilliseconds / _duration.inMilliseconds;
          }
        });
      }
    });

    _player.onDurationChanged.listen((dur) {
      if (mounted) {
        setState(() {
          _duration = dur;
        });
      }
    });
  }

  Future<void> _loadTrack(MusicTrack track) async {
    if (!track.isReady) return;

    try {
      final token = await _authService.getToken();
      final url = '${AppConstants.baseUrl}/music/tracks/${track.id}/file?access_token=$token';
      
      await _player.setSource(
        UrlSource(url),
      );
      _player.resume();
    } catch (e) {
      debugPrint("Error loading audio: $e");
    }
  }

  @override
  void didUpdateWidget(NowPlayingScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.track?.id != oldWidget.track?.id && widget.track != null) {
      _loadTrack(widget.track!);
    }
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _player.dispose();
    super.dispose();
  }

  void _skipNext() {
    if (widget.playlist == null || widget.playlist!.isEmpty || widget.track == null) return;
    
    final currentIndex = widget.playlist!.indexWhere((t) => t.id == widget.track!.id);
    if (currentIndex == -1) return;
    
    final nextIndex = (currentIndex + 1) % widget.playlist!.length;
    final nextTrack = widget.playlist![nextIndex];
    
    if (widget.onTrackChanged != null) {
      widget.onTrackChanged!(nextTrack);
    }
  }

  void _skipPrevious() {
    if (widget.playlist == null || widget.playlist!.isEmpty || widget.track == null) return;
    
    final currentIndex = widget.playlist!.indexWhere((t) => t.id == widget.track!.id);
    if (currentIndex == -1) return;
    
    final prevIndex = (currentIndex - 1 + widget.playlist!.length) % widget.playlist!.length;
    final prevTrack = widget.playlist![prevIndex];
    
    if (widget.onTrackChanged != null) {
      widget.onTrackChanged!(prevTrack);
    }
  }

  String _formatDuration(int? ms) {
    if (ms == null || ms == 0) return '0:00';
    final totalSeconds = (ms / 1000).floor();
    final minutes = (totalSeconds / 60).floor();
    final remainingSeconds = totalSeconds % 60;
    return '$minutes:${remainingSeconds.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Now Playing'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            children: [
              const SizedBox(height: 8),
              // Album art
              _buildAlbumArt(),
              const SizedBox(height: 24),
              // Song info
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.track?.title ?? 'No Track Playing',
                          style: GoogleFonts.inter(
                            fontSize: 22,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.textDark,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          widget.track?.tags ?? 'Select a track to play',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            color: AppTheme.accentBlue,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  // GestureDetector(
                  //   onTap: () {
                  //     setState(() => _isFavorited = !_isFavorited);
                  //   },
                  //   child: Icon(
                  //     _isFavorited ? Icons.favorite : Icons.favorite_border,
                  //     color: _isFavorited
                  //         ? AppTheme.primaryOrange
                  //         : AppTheme.textTertiary,
                  //     size: 26,
                  //   ),
                  // ),
                ],
              ),
              const SizedBox(height: 24),
              // Progress bar
              _buildProgressBar(),
              const SizedBox(height: 24),
              // Controls
              _buildControls(),
              const SizedBox(height: 32),
              // Lyrics
              _buildLyricsSection(),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAlbumArt() {
    return AnimatedBuilder(
      animation: _pulseController,
      builder: (context, child) {
        final glowOpacity = 0.15 + _pulseController.value * 0.15;
        return Container(
          width: double.infinity,
          height: 320,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFFFF00FF).withValues(alpha: glowOpacity),
                blurRadius: 30,
                spreadRadius: 5,
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF0A0A1A), Color(0xFF1A0A2E)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Stack(
                children: [
                  Positioned.fill(
                    child: CustomPaint(
                      painter: _NeonGeometryPainter(_pulseController.value),
                    ),
                  ),
                  if (widget.track?.imageUrl != null)
                    Positioned.fill(
                      child: Image.network(
                        widget.track!.imageUrl!,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => const SizedBox.shrink(),
                      ),
                    ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildProgressBar() {
    return Column(
      children: [
        SliderTheme(
          data: SliderThemeData(
            trackHeight: 4,
            activeTrackColor: AppTheme.accentBlue,
            inactiveTrackColor: AppTheme.dividerColor,
            thumbColor: AppTheme.accentBlue,
            thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
            overlayShape: const RoundSliderOverlayShape(overlayRadius: 14),
          ),
          child: Slider(
            value: _progress.clamp(0.0, 1.0),
            onChanged: (v) {
              final newPos = Duration(milliseconds: (v * _duration.inMilliseconds).round());
              _player.seek(newPos);
            },
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                _formatDuration(_position.inMilliseconds),
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: AppTheme.textSecondary,
                ),
              ),
              Text(
                _formatDuration(_duration.inMilliseconds),
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: AppTheme.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildControls() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        // IconButton(
        //   icon: const Icon(Icons.shuffle, size: 22),
        //   color: AppTheme.textTertiary,
        //   onPressed: () {},
        // ),
        IconButton(
          icon: const Icon(Icons.skip_previous, size: 32),
          color: AppTheme.textDark,
          onPressed: _skipPrevious,
        ),
        // Play/Pause button
        GestureDetector(
          onTap: () {
            if (_isPlaying) {
              _player.pause();
            } else {
              _player.resume();
            }
          },
          child: Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              gradient: AppTheme.orangeGradient,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: AppTheme.primaryOrange.withValues(alpha: 0.3),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Icon(
              _isPlaying ? Icons.pause : Icons.play_arrow,
              color: Colors.white,
              size: 32,
            ),
          ),
        ),
        IconButton(
          icon: const Icon(Icons.skip_next, size: 32),
          color: AppTheme.textDark,
          onPressed: _skipNext,
        ),
        // IconButton(
        //   icon: const Icon(Icons.repeat, size: 22),
        //   color: AppTheme.textTertiary,
        //   onPressed: () {},
        // ),
      ],
    );
  }

  Widget _buildLyricsSection() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                const Icon(Icons.lyrics_outlined,
                    size: 20, color: AppTheme.textDark),
                const SizedBox(width: 8),
                Text(
                  'Lyrics',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textDark,
                  ),
                ),
              ],
            ),
            // TextButton(
            //   onPressed: () {},
            //   child: Text(
            //     'FULL SCREEN',
            //     style: GoogleFonts.inter(
            //       fontSize: 12,
            //       fontWeight: FontWeight.w600,
            //       color: AppTheme.accentBlue,
            //       letterSpacing: 0.5,
            //     ),
            //   ),
            // ),
          ],
        ),
        const SizedBox(height: 8),
        if (widget.track?.lyrics != null && widget.track!.lyrics!.isNotEmpty)
          ...widget.track!.lyrics!.split('\n').map((line) {
            if (line.trim().isEmpty) return const SizedBox(height: 24);
            return Container(
              width: double.infinity,
              margin: const EdgeInsets.only(bottom: 6),
              padding: const EdgeInsets.symmetric(
                vertical: 8,
                horizontal: 4,
              ),
              child: Text(
                line.trim(),
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: AppTheme.textTertiary,
                ),
              ),
            );
          })
        else
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 20),
            child: Text(
              'No lyrics available for this track',
              style: GoogleFonts.inter(
                fontSize: 14,
                color: AppTheme.textTertiary,
                fontStyle: FontStyle.italic,
              ),
              textAlign: TextAlign.center,
            ),
          ),
      ],
    );
  }
}

// Neon geometry painter for album art
class _NeonGeometryPainter extends CustomPainter {
  final double animValue;
  _NeonGeometryPainter(this.animValue);

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5;

    // Draw neon hexagonal shapes
    for (int i = 0; i < 3; i++) {
      final radius = 60.0 + i * 30 + animValue * 8;
      final opacity = 0.6 - i * 0.15;
      paint.color = Color(0xFFFF00FF).withValues(alpha: opacity);

      final path = Path();
      for (int j = 0; j < 6; j++) {
        final angle = (j * 60 - 90 + animValue * 10) * 3.14159 / 180;
        final x = center.dx + radius * _cos(angle);
        final y = center.dy + radius * _sin(angle);
        if (j == 0) {
          path.moveTo(x, y);
        } else {
          path.lineTo(x, y);
        }
      }
      path.close();
      canvas.drawPath(path, paint);
    }
  }

  double _cos(double angle) => angle >= 0
      ? (1 - angle * angle / 2 + angle * angle * angle * angle / 24)
      : _cos(-angle);

  double _sin(double angle) =>
      (angle - angle * angle * angle / 6 + angle * angle * angle * angle * angle / 120);

  @override
  bool shouldRepaint(covariant _NeonGeometryPainter oldDelegate) =>
      oldDelegate.animValue != animValue;
}
