import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';

class NowPlayingScreen extends StatefulWidget {
  const NowPlayingScreen({super.key});

  @override
  State<NowPlayingScreen> createState() => _NowPlayingScreenState();
}

class _NowPlayingScreenState extends State<NowPlayingScreen>
    with SingleTickerProviderStateMixin {
  bool _isPlaying = true;
  bool _isFavorited = true;
  double _progress = 0.32; // 1:12 out of 3:45
  late AnimationController _pulseController;

  final List<Map<String, dynamic>> _lyrics = [
    {'text': 'The static hums a digital prayer', 'active': false},
    {'text': 'Binary dreams floating in the air', 'active': false},
    {'text': 'Searching for a signal in the static...', 'active': true},
    {'text': 'Watching the colors fade to blue...', 'active': false},
    {'text': 'A ghost in the machine calling for you', 'active': false},
  ];

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Now Playing'),
        actions: [
          IconButton(
            icon: const Icon(Icons.queue_music, size: 24),
            onPressed: () {},
          ),
        ],
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
                          'Midnight Synthesis',
                          style: GoogleFonts.inter(
                            fontSize: 22,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.textDark,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'AI Music Mind • Producer X',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            color: AppTheme.accentBlue,
                          ),
                        ),
                      ],
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      setState(() => _isFavorited = !_isFavorited);
                    },
                    child: Icon(
                      _isFavorited ? Icons.favorite : Icons.favorite_border,
                      color: _isFavorited
                          ? AppTheme.primaryOrange
                          : AppTheme.textTertiary,
                      size: 26,
                    ),
                  ),
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
              child: CustomPaint(
                painter: _NeonGeometryPainter(_pulseController.value),
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
            value: _progress,
            onChanged: (v) => setState(() => _progress = v),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '1:12',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: AppTheme.textSecondary,
                ),
              ),
              Text(
                '3:45',
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
        IconButton(
          icon: const Icon(Icons.shuffle, size: 22),
          color: AppTheme.textTertiary,
          onPressed: () {},
        ),
        IconButton(
          icon: const Icon(Icons.skip_previous, size: 32),
          color: AppTheme.textDark,
          onPressed: () {},
        ),
        // Play/Pause button
        GestureDetector(
          onTap: () => setState(() => _isPlaying = !_isPlaying),
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
          onPressed: () {},
        ),
        IconButton(
          icon: const Icon(Icons.repeat, size: 22),
          color: AppTheme.textTertiary,
          onPressed: () {},
        ),
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
            TextButton(
              onPressed: () {},
              child: Text(
                'FULL SCREEN',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.accentBlue,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ...List.generate(_lyrics.length, (i) {
          final lyric = _lyrics[i];
          final isActive = lyric['active'] as bool;
          return Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 6),
            padding: EdgeInsets.symmetric(
              vertical: isActive ? 14 : 8,
              horizontal: isActive ? 16 : 4,
            ),
            decoration: BoxDecoration(
              color: isActive
                  ? AppTheme.accentBlue.withValues(alpha: 0.08)
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(12),
              border: isActive
                  ? Border(
                      left: BorderSide(
                        color: AppTheme.accentBlue,
                        width: 3,
                      ),
                    )
                  : null,
            ),
            child: Text(
              lyric['text'] as String,
              style: GoogleFonts.inter(
                fontSize: isActive ? 16 : 14,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.w400,
                color: isActive ? AppTheme.textDark : AppTheme.textTertiary,
              ),
            ),
          );
        }),
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
