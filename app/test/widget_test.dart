import 'package:flutter_test/flutter_test.dart';
import 'package:ai_music_mind/main.dart';

void main() {
  testWidgets('App renders sign in screen', (WidgetTester tester) async {
    await tester.pumpWidget(const AiMusicMindApp());
    expect(find.text('AI Music Mind'), findsOneWidget);
  });
}
