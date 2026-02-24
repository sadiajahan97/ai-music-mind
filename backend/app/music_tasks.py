from asyncio import create_task, Task

from app.music_utils import task_loop

_task: Task | None = None

def start_music_tasks() -> None:
    global _task

    if _task is not None:
        return

    _task = create_task(task_loop())

def stop_music_tasks() -> None:
    global _task

    if _task is None:
        return

    _task.cancel()

    _task = None