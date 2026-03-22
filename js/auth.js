// auth.js - A purely logical, reusable Supabase wrapper

let supabaseClient;

// 1. Initialize the client
function initAuth(supabaseUrl, supabaseKey) {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
}

// 2. The Login Action (Dynamically grabs the cleanest version of the current URL)
async function loginWith(provider) {
    if (!supabaseClient) return console.error("Auth not initialized!");
    
    // This perfectly strips out trailing # or ? to prevent the double-hash bug
    const cleanRedirectUrl = window.location.href.split('#')[0].split('?')[0];

    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: provider,
        options: { redirectTo: cleanRedirectUrl }
    });
    if (error) console.error("Login error:", error.message);
}

// 3. The Logout Action
async function logout() {
    if (!supabaseClient) return;
    const { error } = await supabaseClient.auth.signOut();
    if (error) console.error("Logout error:", error.message);
}

// 4. The Listener (Tells the page when the user's status changes)
function listenForAuthChanges(onLoginCallback, onLogoutCallback) {
    if (!supabaseClient) return;
    
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (session) {
            onLoginCallback(session); // Pass the session data back to the webpage
        } else {
            onLogoutCallback();       // Tell the webpage they logged out
        }
    });
}