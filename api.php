<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "todo_db";
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["error" => "Koneksi gagal: " . $conn->connect_error]));
}

$action = $_GET['action'] ?? '';

switch ($action) {

    // === CREATE LIST ===
    case 'create_list':
        $name = $_POST['name'] ?? '';
        if ($name != '') {
            $stmt = $conn->prepare("INSERT INTO lists (name) VALUES (?)");
            $stmt->bind_param("s", $name);
            $stmt->execute();
            echo json_encode(["success" => true]);
        }
        break;

    // === READ LISTS ===
    case 'get_lists':
        $result = $conn->query("SELECT * FROM lists ORDER BY id DESC");
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        break;

    // === CREATE TASK ===
    case 'create_task':
        $list_id = $_POST['list_id'] ?? '';
        $name = $_POST['name'] ?? '';
        if ($name != '' && $list_id != '') {
            $stmt = $conn->prepare("INSERT INTO tasks (list_id, name) VALUES (?, ?)");
            $stmt->bind_param("is", $list_id, $name);
            $stmt->execute();
            echo json_encode(["success" => true]);
        }
        break;

    // === READ TASKS ===
    case 'get_tasks':
        $list_id = $_GET['list_id'] ?? '';
        $stmt = $conn->prepare("SELECT * FROM tasks WHERE list_id=? ORDER BY id DESC");
        $stmt->bind_param("i", $list_id);
        $stmt->execute();
        $result = $stmt->get_result();
        echo json_encode($result->fetch_all(MYSQLI_ASSOC));
        break;

    // === UPDATE TASK ===
    case 'update_task':
        $id = $_POST['id'] ?? '';
        $status = $_POST['status'] ?? 'pending';
        $stmt = $conn->prepare("UPDATE tasks SET status=? WHERE id=?");
        $stmt->bind_param("si", $status, $id);
        $stmt->execute();
        echo json_encode(["success" => true]);
        break;

    // === DELETE TASK ===
    case 'delete_task':
        $id = $_POST['id'] ?? '';
        $stmt = $conn->prepare("DELETE FROM tasks WHERE id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(["success" => true]);
        break;
    
    // === EDIT TASK ===
    case 'edit_task':
    $id = $_POST['id'] ?? '';
    $name = $_POST['name'] ?? '';
    $stmt = $conn->prepare("UPDATE tasks SET name=? WHERE id=?");
    $stmt->bind_param("si", $name, $id);
    $stmt->execute();
    echo json_encode(["success" => true]);
    break;

    default:
        echo json_encode(["error" => "Aksi tidak dikenali"]);
}
?>
