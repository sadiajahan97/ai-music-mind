import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';

void showMenuBottomSheet(BuildContext context, String songTitle) {
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.transparent,
    isScrollControlled: true,
    builder: (context) => _MenuBottomSheetContent(songTitle: songTitle),
  );
}

class _MenuBottomSheetContent extends StatelessWidget {
  final String songTitle;

  const _MenuBottomSheetContent({required this.songTitle});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppTheme.surfaceWhite,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 12),
          // Handle
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppTheme.dividerColor,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 16),
          // Song info header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A0A2E),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.music_note,
                    color: Colors.white54,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      songTitle,
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.textDark,
                      ),
                    ),
                    Text(
                      'Action Menu',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        color: AppTheme.accentBlue,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Divider(color: AppTheme.dividerColor, height: 1),
          // Menu items
          _buildMenuItem(
            icon: Icons.edit_note,
            label: 'Remix/Edit',
            onTap: () => Navigator.pop(context),
          ),
          _buildMenuItem(
            icon: Icons.add_circle_outline,
            label: 'Create',
            onTap: () => Navigator.pop(context),
          ),
          _buildMenuItem(
            icon: Icons.diamond_outlined,
            label: 'Get Stems',
            trailing: _buildProBadge(),
            onTap: () => Navigator.pop(context),
          ),
          const Divider(color: AppTheme.dividerColor, height: 1),
          _buildMenuItem(
            icon: Icons.publish_outlined,
            label: 'Publish',
            onTap: () => Navigator.pop(context),
          ),
          _buildMenuItem(
            icon: Icons.info_outline,
            label: 'Song Details',
            onTap: () => Navigator.pop(context),
          ),
          _buildMenuItem(
            icon: Icons.auto_fix_high,
            label: 'Generate Cover Art',
            onTap: () => Navigator.pop(context),
          ),
          _buildMenuItem(
            icon: Icons.share_outlined,
            label: 'Share',
            onTap: () => Navigator.pop(context),
          ),
          _buildMenuItem(
            icon: Icons.download_outlined,
            label: 'Download',
            onTap: () => Navigator.pop(context),
          ),
          _buildMenuItem(
            icon: Icons.report_outlined,
            label: 'Report',
            onTap: () => Navigator.pop(context),
          ),
          _buildMenuItem(
            icon: Icons.delete_outline,
            label: 'Move to Trash',
            color: AppTheme.dangerRed,
            onTap: () => Navigator.pop(context),
          ),
          const Divider(color: AppTheme.dividerColor, height: 1),
          // Cancel button
          SizedBox(
            width: double.infinity,
            child: TextButton(
              onPressed: () => Navigator.pop(context),
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: Text(
                'Cancel',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: AppTheme.textDark,
                ),
              ),
            ),
          ),
          SizedBox(height: MediaQuery.of(context).padding.bottom + 8),
        ],
      ),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String label,
    Widget? trailing,
    Color? color,
    required VoidCallback onTap,
  }) {
    final itemColor = color ?? AppTheme.textDark;
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        child: Row(
          children: [
            Icon(icon, color: itemColor.withValues(alpha: 0.7), size: 22),
            const SizedBox(width: 14),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: itemColor,
              ),
            ),
            if (trailing != null) ...[
              const SizedBox(width: 8),
              trailing,
            ],
            const Spacer(),
            Icon(
              Icons.chevron_right,
              color: AppTheme.textTertiary,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: AppTheme.accentBlue,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        'PRO',
        style: GoogleFonts.inter(
          fontSize: 10,
          fontWeight: FontWeight.w700,
          color: Colors.white,
        ),
      ),
    );
  }
}
