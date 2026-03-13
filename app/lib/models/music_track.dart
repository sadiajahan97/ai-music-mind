class MusicTrack {
  final String id;
  final String title;
  final String? tags;
  final int? duration;
  final bool isReady;
  final String? imageUrl;

  MusicTrack({
    required this.id,
    required this.title,
    this.tags,
    this.duration,
    required this.isReady,
    this.imageUrl,
  });

  factory MusicTrack.fromJson(Map<String, dynamic> json) {
    return MusicTrack(
      id: json['id'],
      title: json['title'] ?? 'Untitled',
      tags: json['tags'],
      duration: json['duration'],
      isReady: json['isReady'] ?? false,
      imageUrl: json['imageUrl'],
    );
  }
}
