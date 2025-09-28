from polaris.models import Task, Client

class SendWelcomeEmailTask(Task):
    """
    A task to simulate sending a welcome email to a client.
    """
    def execute(self, client: Client) -> None:
        """
        Simulates sending a welcome email. In a real scenario, this method
        would contain logic to connect to an email server and send the email.
        """
        print(f"-> Sending welcome email to {client.email}...")
        # Simulate a successful action
        print(f"   Email successfully sent to {client.name} at {client.email}.")