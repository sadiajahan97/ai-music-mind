import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';

class AdvancedScreen extends StatefulWidget {
  const AdvancedScreen({super.key});

  @override
  State<AdvancedScreen> createState() => _AdvancedScreenState();
}

class _AdvancedScreenState extends State<AdvancedScreen> {
  int _lyricsMode = 0; // 0 = Manual, 1 = Auto-Fill
  int _vocalGender = 0; // 0 = Male, 1 = Female, 2 = Duet
  double _weirdness = 0.42;
  double _styleInfluence = 0.8;
  final List<String> _genres = [
    'Synthwave',
    "80's Pop",
    'Melodic',
    'Electronic',
    'Upbeat',
  ];
  int _selectedGenre = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Advanced Customization'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 8),
            // Lyrics section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Lyrics',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textDark,
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  child: Text(
                    'Generate with AI',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.accentBlue,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                color: AppTheme.surfaceWhite,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.dividerColor),
              ),
              child: TextField(
                maxLines: 5,
                decoration: InputDecoration(
                  hintText:
                      'Enter your lyrics here or let AI Music Mind write them for you...',
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  contentPadding: const EdgeInsets.all(16),
                  hintStyle: GoogleFonts.inter(
                    fontSize: 14,
                    color: AppTheme.textTertiary,
                    height: 1.5,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Manual Mode / Auto-Fill toggle
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: AppTheme.surfaceWhite,
                borderRadius: BorderRadius.circular(30),
                border: Border.all(color: AppTheme.dividerColor),
              ),
              child: Row(
                children: [
                  _buildToggleOption('Manual Mode', 0),
                  _buildToggleOption('Auto-Fill', 1),
                ],
              ),
            ),
            const SizedBox(height: 28),
            // Styles & Genre
            Text(
              'Styles & Genre',
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppTheme.textDark,
              ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                ...List.generate(_genres.length, (i) {
                  final selected = _selectedGenre == i;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedGenre = i),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 18,
                        vertical: 10,
                      ),
                      decoration: BoxDecoration(
                        color: selected
                            ? AppTheme.primaryOrange
                            : AppTheme.surfaceWhite,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: selected
                              ? AppTheme.primaryOrange
                              : AppTheme.dividerColor,
                        ),
                      ),
                      child: Text(
                        _genres[i],
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: selected ? Colors.white : AppTheme.textDark,
                        ),
                      ),
                    ),
                  );
                }),
                GestureDetector(
                  onTap: () {},
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 18,
                      vertical: 10,
                    ),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceWhite,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppTheme.dividerColor),
                    ),
                    child: Text(
                      '+ Add Style',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: AppTheme.accentBlue,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 28),
            // Advanced Options header
            Text(
              'Advanced Options',
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppTheme.textDark,
              ),
            ),
            const SizedBox(height: 20),
            // Vocal Gender
            Text(
              'Vocal Gender',
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppTheme.textDark,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _buildVocalOption(Icons.face, 'Male', 0),
                const SizedBox(width: 16),
                _buildVocalOption(Icons.face_3, 'Female', 1),
                // const SizedBox(width: 16),
                // _buildVocalOption(Icons.people, 'Duet', 2),
              ],
            ),

            const SizedBox(height: 28),
            // Weirdness slider
            _buildSlider(
              label: 'Weirdness',
              value: _weirdness,
              displayValue: '${(_weirdness * 100).round()}%',
              leftLabel: 'Conservative',
              rightLabel: 'Experimental',
              onChanged: (v) => setState(() => _weirdness = v),
            ),
            const SizedBox(height: 24),
            // Style Influence slider
            _buildSlider(
              label: 'Style Influence',
              value: _styleInfluence,
              displayValue: _styleInfluence > 0.7
                  ? 'High'
                  : _styleInfluence > 0.4
                      ? 'Medium'
                      : 'Low',
              displayColor: AppTheme.accentBlue,
              leftLabel: 'Subtle',
              rightLabel: 'Strong',
              onChanged: (v) => setState(() => _styleInfluence = v),
            ),
            const SizedBox(height: 36),
            // Create Music button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: AppTheme.orangeGradient,
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.primaryOrange.withValues(alpha: 0.3),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: ElevatedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.auto_awesome, size: 20),
                  label: Text(
                    'Create Music',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),

          ],
        ),
      ),
    );
  }

  Widget _buildToggleOption(String label, int index) {
    final selected = _lyricsMode == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _lyricsMode = index),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: selected ? AppTheme.surfaceWhite : Colors.transparent,
            borderRadius: BorderRadius.circular(26),
            border: selected
                ? Border.all(color: AppTheme.accentBlue, width: 1.5)
                : null,
          ),
          child: Center(
            child: Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                color: selected ? AppTheme.accentBlue : AppTheme.textTertiary,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildVocalOption(IconData icon, String label, int index) {
    final selected = _vocalGender == index;
    return GestureDetector(
      onTap: () => setState(() => _vocalGender = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: 80,
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: selected ? AppTheme.primaryOrange.withValues(alpha: 0.1) : AppTheme.surfaceWhite,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: selected ? AppTheme.primaryOrange : AppTheme.dividerColor,
            width: selected ? 2 : 1,
          ),
        ),
        child: Column(
          children: [
            Icon(
              icon,
              size: 28,
              color: selected ? AppTheme.primaryOrange : AppTheme.textTertiary,
            ),
            const SizedBox(height: 6),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                color: selected ? AppTheme.primaryOrange : AppTheme.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSlider({
    required String label,
    required double value,
    required String displayValue,
    required String leftLabel,
    required String rightLabel,
    required ValueChanged<double> onChanged,
    Color? displayColor,
  }) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppTheme.textDark,
              ),
            ),
            Text(
              displayValue,
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: displayColor ?? AppTheme.primaryOrange,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        SliderTheme(
          data: SliderThemeData(
            trackHeight: 6,
            activeTrackColor: AppTheme.primaryOrange,
            inactiveTrackColor: AppTheme.dividerColor,
            thumbColor: AppTheme.primaryOrange,
            thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 8),
            overlayShape: const RoundSliderOverlayShape(overlayRadius: 16),
            trackShape: const RoundedRectSliderTrackShape(),
          ),
          child: Slider(
            value: value,
            onChanged: onChanged,
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                leftLabel,
                style: GoogleFonts.inter(
                  fontSize: 11,
                  color: AppTheme.textTertiary,
                ),
              ),
              Text(
                rightLabel,
                style: GoogleFonts.inter(
                  fontSize: 11,
                  color: AppTheme.textTertiary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
