import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import 'now_playing_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<String> _tabs = ['For You', 'Trending', 'Recent', 'Favorite'];

  final List<Map<String, dynamic>> _feedSongs = [
    {
      'title': 'Neural Symphony #5',
      'genre': 'Classical Fusion',
      'duration': '3:45',
      'likes': '124',
      'liked': false,
      'color': const Color(0xFF1E3A5F),
    },
    {
      'title': 'Lo-Fi Algorithms',
      'genre': 'Lo-Fi Beats',
      'duration': '4:20',
      'likes': '89',
      'liked': true,
      'color': const Color(0xFF8B6914),
    },
    {
      'title': 'Midnight Processing',
      'genre': 'Synthwave',
      'duration': '2:58',
      'likes': '2.4k',
      'liked': false,
      'color': const Color(0xFF2D1B69),
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 8),
            // Tab bar
            TabBar(
              controller: _tabController,
              isScrollable: true,
              labelColor: AppTheme.textDark,
              unselectedLabelColor: AppTheme.textTertiary,
              indicatorColor: AppTheme.textDark,
              indicatorWeight: 2.5,
              labelStyle: GoogleFonts.inter(
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
              unselectedLabelStyle: GoogleFonts.inter(
                fontSize: 15,
                fontWeight: FontWeight.w400,
              ),
              tabAlignment: TabAlignment.start,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              tabs: _tabs.map((t) => Tab(text: t)).toList(),
            ),
            // Content
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: List.generate(
                  _tabs.length,
                  (_) => _buildForYouTab(),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildForYouTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Latest Generation header
          Row(
            children: [
              const Icon(Icons.auto_awesome, color: AppTheme.accentBlue, size: 20),
              const SizedBox(width: 8),
              Text(
                'Latest Generation',
                style: GoogleFonts.inter(
                  fontSize: 17,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Featured card
          _buildFeaturedCard(),
          const SizedBox(height: 28),
          // Your Feed
          Text(
            'Your Feed',
            style: GoogleFonts.inter(
              fontSize: 17,
              fontWeight: FontWeight.w600,
              color: AppTheme.textDark,
            ),
          ),
          const SizedBox(height: 12),
          // Feed songs
          ...List.generate(
            _feedSongs.length,
            (i) => _buildFeedSongItem(_feedSongs[i], i),
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturedCard() {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const NowPlayingScreen()),
        );
      },
      child: Container(
        height: 220,
        width: double.infinity,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: const LinearGradient(
            colors: [Color(0xFF1A0A2E), Color(0xFF2D1B4E)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF1A0A2E).withValues(alpha: 0.3),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Waveform effect
            Positioned.fill(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: CustomPaint(painter: _WaveformPainter()),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    'ELECTRONIC FUSION',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: Colors.white70,
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Cybernetic Echoes',
                    style: GoogleFonts.inter(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryOrange,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.play_arrow,
                              color: Colors.white,
                              size: 18,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              'Play Now',
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        onPressed: () {},
                        icon: const Icon(
                          Icons.favorite_border,
                          color: Colors.white70,
                          size: 22,
                        ),
                      ),
                      IconButton(
                        onPressed: () {},
                        icon: const Icon(
                          Icons.share_outlined,
                          color: Colors.white70,
                          size: 22,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeedSongItem(Map<String, dynamic> song, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.surfaceWhite,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Thumbnail
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: song['color'] as Color,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Center(
              child: Icon(
                Icons.play_circle_outline,
                color: Colors.white70,
                size: 28,
              ),
            ),
          ),
          const SizedBox(width: 12),
          // Info
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
                  '${song['genre']} • ${song['duration']}',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    color: AppTheme.textSecondary,
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Icon(
                      (song['liked'] as bool)
                          ? Icons.favorite
                          : Icons.favorite_border,
                      size: 16,
                      color: (song['liked'] as bool)
                          ? AppTheme.heartRed
                          : AppTheme.textTertiary,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      song['likes'] as String,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Icon(
                      Icons.share_outlined,
                      size: 16,
                      color: AppTheme.textTertiary,
                    ),
                    const SizedBox(width: 12),
                    Icon(
                      Icons.more_horiz,
                      size: 16,
                      color: AppTheme.textTertiary,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// Custom painter for audio waveform visual
class _WaveformPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    final centerY = size.height * 0.45;
    final barCount = 60;
    final barWidth = size.width / barCount;

    for (int i = 0; i < barCount; i++) {
      final x = i * barWidth;
      final progress = i / barCount;
      final amplitude = _waveAmplitude(progress) * size.height * 0.35;

      final gradient = LinearGradient(
        begin: Alignment.bottomCenter,
        end: Alignment.topCenter,
        colors: [
          const Color(0xFFFF6B00).withValues(alpha: 0.8),
          const Color(0xFFFFAA00).withValues(alpha: 0.6),
          const Color(0xFFFFDD00).withValues(alpha: 0.3),
        ],
      );

      paint.shader = gradient.createShader(
        Rect.fromLTRB(x, centerY - amplitude, x + barWidth * 0.6, centerY + amplitude),
      );

      canvas.drawLine(
        Offset(x + barWidth * 0.2, centerY - amplitude),
        Offset(x + barWidth * 0.2, centerY + amplitude),
        paint,
      );
    }
  }

  double _waveAmplitude(double progress) {
    // Create an organic waveform shape
    if (progress < 0.15) return 0.2 + progress * 2;
    if (progress < 0.35) return 0.5 + (progress - 0.15) * 2.5;
    if (progress < 0.55) return 1.0 - (progress - 0.35) * 1.5;
    if (progress < 0.75) return 0.7 + (progress - 0.55) * 1.0;
    return 0.9 - (progress - 0.75) * 3.0;
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
