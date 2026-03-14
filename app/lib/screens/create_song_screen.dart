import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import '../widgets/bottom_nav_bar.dart';
import '../services/music_service.dart';


class CreateSongScreen extends StatefulWidget {
  const CreateSongScreen({super.key});

  @override
  State<CreateSongScreen> createState() => _CreateSongScreenState();
}

class _CreateSongScreenState extends State<CreateSongScreen> {
  /*
  int _selectedOutputMode = 0;
  final List<String> _outputModes = ['Song', /*'Lyrics',*/ 'Instrumental'];
  final List<IconData> _outputIcons = [
    Icons.equalizer,
    // Icons.text_snippet_outlined,
    Icons.piano_outlined,
  ];
  */



  int _vocalGender = 0; // 0 = Male, 1 = Female, 2 = Duet
  double _weirdnessConstraint = 0.5;
  double _styleWeight = 0.5;

  final List<String> _styles = [
    'Blues',
    'Classical',
    'Country',
    'Electronic',
    'Hip Hop',
    'Jazz',
    'Pop',
    'Reggae',
    'Rock',
    'Soul',
  ];
  int _selectedStyle = 0;
  final List<String> _languages = ['English', 'Bangla', 'Hindi', 'Chinese'];
  int _selectedLanguage = 0;

  final MusicService _musicService = MusicService();
  final TextEditingController _promptController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _promptController.dispose();
    super.dispose();
  }

  Future<void> _handleGenerate() async {
    final prompt = _promptController.text.trim();
    if (prompt.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a song description')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final gender = _vocalGender == 1 ? 'f' : 'm';
      
      await _musicService.generateMusic(
        userPrompt: prompt,
        style: _styles[_selectedStyle],
        vocalGender: gender,
        styleWeight: _styleWeight,
        weirdnessConstraint: _weirdnessConstraint,
        language: _languages[_selectedLanguage].toLowerCase(),
      );

      if (mounted) {
        // Success! Go to Library screen (index 1 in MainScreen)
        Navigator.pop(context, 1);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Create New Song'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 8),
            // Song Description
            Text(
              'Song Description',
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppTheme.textDark,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(
                color: AppTheme.surfaceWhite,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: AppTheme.primaryOrange.withValues(alpha: 0.3),
                ),
              ),
              child: Stack(
                children: [
                  TextField(
                    controller: _promptController,
                    maxLines: 4,
                    decoration: InputDecoration(
                      hintText:
                          'Describe the mood, instruments, and style... (e.g., A futuristic synthwave track with a nostalgic feel, featuring airy vocals and a driving 80s beat)',
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
                  /*
                  Positioned(
                    bottom: 8,
                    right: 8,
                    child: Icon(
                      Icons.auto_awesome,
                      color: AppTheme.accentBlue,
                      size: 20,
                    ),
                  ),
                  */
                ],
              ),
            ),
            const SizedBox(height: 28),
            /*
            // Output Mode
            Text(
              'Output Mode',
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppTheme.textDark,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: AppTheme.surfaceWhite,
                borderRadius: BorderRadius.circular(30),
                border: Border.all(color: AppTheme.dividerColor),
              ),
              child: Row(
                children: List.generate(_outputModes.length, (i) {
                  final selected = _selectedOutputMode == i;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _selectedOutputMode = i),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: selected
                              ? AppTheme.primaryOrange
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(26),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              _outputIcons[i],
                              size: 18,
                              color:
                                  selected ? Colors.white : AppTheme.textSecondary,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              _outputModes[i],
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: selected
                                    ? Colors.white
                                    : AppTheme.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ),
            const SizedBox(height: 28),
            */
            // Style
            Text(
              'Style',
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
                ...List.generate(_styles.length, (i) {
                  final selected = _selectedStyle == i;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedStyle = i),
                    child: MouseRegion(
                      cursor: SystemMouseCursors.basic,
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
                          _styles[i],
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: selected ? Colors.white : AppTheme.textDark,
                          ),
                        ),
                      ),
                    ),
                  );
                }),
                /*
                GestureDetector(
                  onTap: () {},
                  child: MouseRegion(
                    cursor: SystemMouseCursors.basic,
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
                ),
                */
              ],
            ),
            const SizedBox(height: 28),
            // Language
            Text(
              'Language',
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
              children: List.generate(_languages.length, (i) {
                final selected = _selectedLanguage == i;
                return GestureDetector(
                  onTap: () => setState(() => _selectedLanguage = i),
                  child: MouseRegion(
                    cursor: SystemMouseCursors.basic,
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
                        _languages[i],
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: selected ? Colors.white : AppTheme.textDark,
                        ),
                      ),
                    ),
                  ),
                );
              }),
            ),
            const SizedBox(height: 28),
            // Vocal Gender
            Text(
              'Vocal Gender',
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppTheme.textDark,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _buildVocalOption(Icons.face, 'Male', 0),
                const SizedBox(width: 16),
                _buildVocalOption(Icons.face_3, 'Female', 1),
              ],
            ),
            const SizedBox(height: 28),
            // Style Weight slider
            _buildSlider(
              label: 'Style Weight',
              value: _styleWeight,
              displayValue: '${(_styleWeight * 100).round()}%',
              leftLabel: 'Subtle',
              rightLabel: 'Strong',
              onChanged: (v) => setState(() => _styleWeight = v),
            ),
            const SizedBox(height: 28),
            // Weirdness Constraint slider
            _buildSlider(
              label: 'Weirdness Constraint',
              value: _weirdnessConstraint,
              displayValue: '${(_weirdnessConstraint * 100).round()}%',
              leftLabel: 'Conservative',
              rightLabel: 'Experimental',
              onChanged: (v) => setState(() => _weirdnessConstraint = v),
            ),
            const SizedBox(height: 32),
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
                  onPressed: _isLoading ? null : _handleGenerate,
                  icon: _isLoading 
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Icon(Icons.auto_awesome, size: 20),
                  label: Text(
                    _isLoading ? 'Generating...' : 'Create Music',
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
                  ).copyWith(
                    overlayColor: WidgetStateProperty.all(Colors.transparent),
                    mouseCursor: WidgetStateProperty.all(SystemMouseCursors.basic),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavBar(
        currentIndex: -1,
        onTap: (index) {
          Navigator.pop(context, index);
        },
        onFabPressed: () {},
      ),
    );
  }



  Widget _buildVocalOption(IconData icon, String label, int index) {
    final selected = _vocalGender == index;
    return GestureDetector(
      onTap: () => setState(() => _vocalGender = index),
      child: MouseRegion(
        cursor: SystemMouseCursors.basic,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: 80,
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            color: selected
                ? AppTheme.primaryOrange.withValues(alpha: 0.1)
                : AppTheme.surfaceWhite,
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
                color:
                    selected ? AppTheme.primaryOrange : AppTheme.textTertiary,
              ),
              const SizedBox(height: 6),
              Text(
                label,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                  color: selected
                      ? AppTheme.primaryOrange
                      : AppTheme.textSecondary,
                ),
              ),
            ],
          ),
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
                fontSize: 16,
                fontWeight: FontWeight.w700,
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
            overlayShape: const RoundSliderOverlayShape(overlayRadius: 0),
            overlayColor: WidgetStateColor.transparent,
            trackShape: const RoundedRectSliderTrackShape(),
            mouseCursor: const WidgetStatePropertyAll(SystemMouseCursors.basic),
          ),
          child: MouseRegion(
            cursor: SystemMouseCursors.basic,
            child: Slider(
              value: value,
              onChanged: onChanged,
            ),
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
