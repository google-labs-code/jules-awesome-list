from dataclasses import dataclass
from typing import List, Any

@dataclass
class Client:
    """Represents a client of Nova Cloud."""
    name: str
    email: str
    # We can add more client details here later
    # For example: company_name: str, phone_number: str

class Task:
    """A single action to be performed in a campaign. This is a base class."""
    def execute(self, client: Client) -> None:
        """Executes the task for a given client."""
        raise NotImplementedError("Subclasses must implement the 'execute' method.")

@dataclass
class Campaign:
    """Represents a series of tasks to be executed for a client."""
    name: str
    client: Client
    tasks: List[Task]

    def run(self) -> None:
        """Runs all tasks in the campaign sequentially."""
        print(f"Starting campaign '{self.name}' for client '{self.client.name}'...")
        for task in self.tasks:
            task.execute(self.client)
        print(f"Campaign '{self.name}' completed for client '{self.client.name}'.")