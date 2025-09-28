from polaris.models import Client, Campaign
from polaris.tasks import SendWelcomeEmailTask

def main():
    """
    This is the main entry point for the Polaris Agent.
    For now, it runs a sample campaign.
    """
    print("Initializing Polaris Agent...")

    # 1. Create a sample client
    sample_client = Client(name="Innovate Corp", email="contact@innovatecorp.com")
    print(f"Created sample client: {sample_client.name}")

    # 2. Define the tasks for the campaign
    tasks = [
        SendWelcomeEmailTask(),
        # We can add more tasks here in the future
    ]
    print(f"Defined {len(tasks)} task(s) for the campaign.")

    # 3. Create the campaign
    welcome_campaign = Campaign(
        name="Onboarding Welcome Campaign",
        client=sample_client,
        tasks=tasks
    )
    print(f"Created campaign: '{welcome_campaign.name}'")

    # 4. Run the campaign
    welcome_campaign.run()

    print("\nPolaris Agent finished its run.")

if __name__ == "__main__":
    main()